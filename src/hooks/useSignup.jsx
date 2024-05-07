import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'
import { auth, storage, db } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { dispatch } = useAuthContext()

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null)
    setIsPending(true)

    try {
      // signup user
      const res = await createUserWithEmailAndPassword(auth, email, password)

      if (!res.user) {
        throw new Error(
          'We could not complete your sign up. Please try again after some time!'
        )
      }

      // upload user profile thumbnail image
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
      const imgRef = ref(storage, uploadPath)

      // upload bytes instead of file directly
      const uploadTask = uploadBytesResumable(imgRef, thumbnail)

      // listen for state changes of the upload task
      uploadTask.on('state_changed', (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setUploadProgress(progress)
        if (process.env.NODE_ENV !== 'production') {
          console.log('Upload is ' + progress + '% done')
        }
      })

      await uploadTask

      const photoURL = await getDownloadURL(uploadTask.snapshot.ref)

      // add display name and thumbnail image to user
      await updateProfile(res.user, { displayName, photoURL })

      // create a user document
      const usersCollectionRef = doc(db, 'users', res.user.uid)
      await setDoc(usersCollectionRef, {
        online: true,
        displayName,
        photoURL,
      })

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      // update state
      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }

      //return here is to prevent further execution of the function if isCancelled is true
      return
    } catch (err) {
      if (!isCancelled) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(err.message)
        }
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('The component is unmounted')
      }
      setIsCancelled(true)
    }
  }, [isCancelled])

  return { error, isPending, signup, uploadProgress }
}

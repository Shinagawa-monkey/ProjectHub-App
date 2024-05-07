import { Image } from 'react-bootstrap'
import { useTheme } from '../hooks/useTheme'

//styles & images
import styles from './Avatar.module.css'
import PlaceholderAvatar from '../assets/noAvatar.png'

export default function Avatar({ src, size = 50, padding = true }) {
  const { mode } = useTheme()
  const avatarClassName = `d-flex align-items-center justify-content-center ${
    padding ? 'py-3' : 'p-0'
  }`

  return (
    <div className={avatarClassName}>
      <Image
        src={src || PlaceholderAvatar}
        alt="user avatar image"
        roundedCircle
        width={size}
        height={size}
        className={mode === 'dark' ? styles['img-dark'] : styles.img}
      />
    </div>
  )
}

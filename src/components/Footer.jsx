import { Card } from 'react-bootstrap'
import { useTheme } from '../hooks/useTheme'

//styles & images
import styles from './Footer.module.css'
import heartLight from '../assets/heartLight.svg'
import heartDark from '../assets/heartDark.svg'

export default function Footer() {
  const { mode } = useTheme()

  //get the current year
  const currentYear = new Date().getFullYear()

  return (
    <Card
      className={`w-100 bg-light text-center rounded-0 d-flex ${styles.footer}`}
    >
      <Card.Footer
        className="text-muted rounded-0"
        style={{
          backgroundColor: mode === 'light' ? '#E3E3E3' : '#333333',
        }}
      >
        Made with{' '}
        <Card.Img
          className={`${styles.img} ${
            mode === 'dark' ? styles['img-dark'] : ''
          }`}
          src={mode === 'light' ? heartLight : heartDark}
          alt="Heart Icon"
        />{' '}
        by Elena Shatalova &copy; {currentYear}
      </Card.Footer>
    </Card>
  )
}

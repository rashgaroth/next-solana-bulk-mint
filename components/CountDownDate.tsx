import { Box, Stack } from '@mui/material'
import { ICountDownDate } from 'interfaces/ICountDownDate'
import styles from 'styles/Dashboard.module.css'

const CountDownDate = ({ days, hours, minutes, seconds }: ICountDownDate) => {
  return (
    <Stack direction={'row'} spacing={3} alignItems="center" mt={2} sx={{ zIndex: 1000 }}>
      <Box sx={{ borderRadius: 4, bgcolor: 'primary.light', p: 2, opacity: 1 }}>
        <p className={styles.buttonText} style={{ textAlign: 'center', fontSize: 22, alignSelf: 'center' }}>
          {days} Days
        </p>
      </Box>
      <Box sx={{ borderRadius: 4, bgcolor: 'primary.light', p: 2 }}>
        <p className={styles.buttonText} style={{ textAlign: 'center', fontSize: 22, alignSelf: 'center' }}>
          {hours} Hours
        </p>
      </Box>
      <Box sx={{ borderRadius: 4, bgcolor: 'primary.light', p: 2 }}>
        <p className={styles.buttonText} style={{ textAlign: 'center', fontSize: 22, alignSelf: 'center' }}>
          {minutes} Minutes
        </p>
      </Box>
      <Box sx={{ borderRadius: 4, bgcolor: 'primary.light', p: 2 }}>
        <p className={styles.buttonText} style={{ textAlign: 'center', fontSize: 22, alignSelf: 'center' }}>
          {seconds} Seconds
        </p>
      </Box>
    </Stack>
  )
}

export default CountDownDate

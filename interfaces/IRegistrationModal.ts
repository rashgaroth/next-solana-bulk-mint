export interface IRegistrationModal {
  open: boolean
  handleClose: () => void
  connection: any
  onFinish: () => void
}

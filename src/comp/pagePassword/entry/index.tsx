import './style.css'

export type PasswordEntryProps = {
  entryTitle: string;
  entrySubTitle: string;
  callback: () => void;
}

export const PasswordEntry = (props: PasswordEntryProps) => {
  return (
    <div className="entryContainer" onClick={props.callback}>
      <div className="entryTitel">{props.entryTitle}</div>
      <div className="entrySubTitle">{props.entrySubTitle}</div>
    </div>
  )
}
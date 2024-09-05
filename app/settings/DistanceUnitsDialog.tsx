import { Field, Label, Radio, RadioGroup } from '@headlessui/react'
import { useState } from 'react'
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

interface IProps {
  handleClose: any
  isOpen: boolean
}

export default function DistanceUnitsDialog(props: IProps) {
  // @TODO use obj w/ value-label for
  const distanceUnits = ['meters', 'miles']
  const units = localStorage.getItem('distanceUnits')
  let [selected, setSelected] = useState(units ?? '')

  const handleSave = () => {
    localStorage.setItem('distanceUnits', selected)
    props.handleClose()
  }

  return (
    <Dialog open={props.isOpen} onClose={() => props.handleClose(false)} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
          <DialogTitle className="font-bold">Units for distance</DialogTitle>
          <Description>Used to show how close nearby shops are.</Description>

          <RadioGroup value={selected} onChange={setSelected} aria-label="Server size">
            {distanceUnits.map(unit => (
              <Field key={unit} className="flex items-center gap-2">
                <Radio
                  value={unit}
                  className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-blue-400"
                >
                  <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
                </Radio>
                <Label className={selected === unit ? 'font-bold' : ''}>{unit}</Label>
              </Field>
            ))}
          </RadioGroup>
          <div className="flex gap-4">
            <button onClick={() => props.handleClose()}>Cancel</button>
            <button onClick={() => handleSave()}>Save</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

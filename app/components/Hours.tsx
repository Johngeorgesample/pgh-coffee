'use client'

interface IProps {}

const hours = {
  mon: { status: 'open', open: '09:00', close: '16:00' },
  tue: { status: 'open', open: '09:00', close: '16:00' },
  wed: { status: 'closed' },
  thu: { status: 'unknown' },
  fri: { status: 'open', open: '09:00', close: '16:00' },
  sat: { status: 'open', open: '10:00', close: '14:00' },
  sun: { status: 'closed' },
};

export default function Hours(props: IProps) {
  return (
    <div>
      {Object.entries(hours).map(([day, info]) => (
        <div key={day} className="flex gap-2">
          <p className="mr-auto">{day}</p>
          {info.status === 'open' ? (
            <>
              <p>{info.open}</p>
              <p>{info.close}</p>
            </>
          ) : (
            <p>{info.status}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default function JoinTheCommunity() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold">Join the Community</h2>
      <p className="text-lg text-slate-600 dark:text-slate-400">
        Want to help make Pittsburgh&apos;s coffee scene even better? We&apos;re a
        community-driven platform and we rely on your local expertise.
      </p>

      <ul className="space-y-4">
        <li className="flex gap-4">
          <span className="material-icons-outlined text-primary">add_location_alt</span>
          <p>
            <strong>Submit a Shop:</strong> Found a hidden gem? Let us know.
          </p>
        </li>
        <li className="flex gap-4">
          <span className="material-icons-outlined text-primary">feedback</span>
          <p>
            <strong>Provide Feedback:</strong> Help us improve the experience.
          </p>
        </li>
        <li className="flex gap-4">
          <span className="material-icons-outlined text-primary">share</span>
          <p>
            <strong>Spread the Word:</strong> Share your favorites on social media.
          </p>
        </li>
      </ul>
    </div>
  )
}

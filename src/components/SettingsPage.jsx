export default function SettingsPage() {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">WORKSPACE</span>
          <h1>Settings</h1>
          <p>Information about this demonstration workspace.</p>
        </div>
      </div>
      <section className="panel settings-panel">
        <h2>System information</h2>
        <div className="settings-row">
          <span>System</span>
          <strong>FUNews Management System</strong>
        </div>
        <div className="settings-row">
          <span>Account</span>
          <strong>Admin (demo)</strong>
        </div>
        <div className="settings-row">
          <span>Data source</span>
          <strong>Browser localStorage</strong>
        </div>
        <div className="settings-row">
          <span>Session</span>
          <strong>Browser sessionStorage</strong>
        </div>
        <p className="settings-note">
          This assignment uses mock authentication and local data. It does not
          connect to a backend or database.
        </p>
      </section>
    </>
  );
}

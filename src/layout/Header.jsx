import "../styles/layout.css"



function Header({ user }) {
  const initial = user?.email?.charAt(0)?.toUpperCase()

  return (
    <div className="header-bar">

      {/* LEFT */}
      <h1 className="page-title">Dashboard</h1>

      {/* RIGHT PROFILE */}
      <div className="profile">
        <div className="avatar">{initial}</div>

        <div className="user-info">
          <p className="email">{user?.email}</p>
          <span className="role">Active User</span>
        </div>
      </div>

    </div>
  )
}

export default Header
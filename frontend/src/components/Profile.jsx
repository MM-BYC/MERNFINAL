import * as userService from '../utilities/users-service'

function Profile({ user, setUser }) {
  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }
  return (
    <div>
      Welcome {user.name}! <hr />
      Currently Logged In:  {user.email}<br/>
      <button onClick={handleLogOut}>LogOut</button>
    </div>
  );
}

export default Profile;

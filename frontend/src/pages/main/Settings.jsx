import { useEffect, useState } from "react";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { Spinner } from "../../components/icons/Spinner";

export default function Settings() {
  const authHttpClient = useAuthHttpClient();
  const [user, setUser] = useState({});
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [err, seterr] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await authHttpClient.get("/auth/getInfo");
        setUser(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserInfo();
  }, []);

  const changeInfo = async () => {
    setUpdating(true);
    try {
      await authHttpClient.post("/auth/changeInfo", {
        user,
      });
      setUpdating(false);
    } catch (error) {
      console.log(error);
      setUpdating(false);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      seterr({ confirmPassword: "Passwords do not match!" });
      return;
    }
    seterr({});
    setChangingPassword(true);
    try {
      const response = await authHttpClient.post("/auth/changePassword", {
        password,
        newPassword,
      });
      const { error } = response.data;
      error && seterr(error);
      setChangingPassword(false);
    } catch (error) {
      console.log(error);
      setChangingPassword(false);
    }
  };

  return (
    <div>
      <main>
        {/* Settings forms */}
        <div className="divide-y divide-white/5">
          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7 ">
                Personal Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Use a permanent address where you can receive mail.
              </p>
            </div>

            <form className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 "
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      value={user.first_name}
                      onChange={(e) => {
                        setUser({
                          ...user,
                          first_name: e.target.value,
                        });
                      }}
                      className="block w-full rounded-md py-1.5 shadow-sm border-0 ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium leading-6 "
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      value={user.last_name}
                      onChange={(e) => {
                        setUser({
                          ...user,
                          last_name: e.target.value,
                        });
                      }}
                      className="block w-full rounded-md border-0 py-1.5 ring-gray-700 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 "
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={user.email}
                      onChange={(e) => {
                        setUser({
                          ...user,
                          email: e.target.value,
                        });
                      }}
                      className="block w-full rounded-md border-0 py-1.5 ring-gray-700 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 "
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md ring-1 ring-gray-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500">
                      <span className="flex select-none items-center pl-3 text-gray-400 sm:text-sm">
                        example.com/
                      </span>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={user.user_name}
                        onChange={(e) => {
                          setUser({
                            ...user,
                            user_name: e.target.value,
                          });
                        }}
                        className="flex-1 border-0 bg-transparent py-1.5 pl-1 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="janesmith"
                      />
                    </div>
                  </div>
                </div>

                {/* <div className="col-span-full">
                      <label htmlFor="timezone" className="block text-sm font-medium leading-6 ">
                        Timezone
                      </label>
                      <div className="mt-2">
                        <select
                          id="timezone"
                          name="timezone"
                          className="block w-full rounded-md border-0 py-1.5 ring-gray-700 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6 [&_*]:text-black"
                        >
                          <option>Pacific Standard Time</option>
                          <option>Eastern Standard Time</option>
                          <option>Greenwich Mean Time</option>
                        </select>
                      </div>
                    </div> */}
              </div>

              <div className="mt-8 flex">
                <button
                  onClick={() => {
                    changeInfo();
                  }}
                  type="button"
                  className="rounded-md text-white bg-primary-600 px-3 py-2 text-sm font-semibold ring-gray-700 shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  {updating ? <Spinner small center /> : "Save"}
                </button>
              </div>
            </form>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7 ">
                Change password
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Update your password associated with your account.
              </p>
            </div>

            <form className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="current-password"
                    className="block text-sm font-medium leading-6 "
                  >
                    Current password
                  </label>
                  <div className="mt-2">
                    <input
                      id="current-password"
                      name="current_password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-1.5 ring-gray-700 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {err?.password && (
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      {err?.password}
                    </p>
                  )}
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium leading-6 "
                  >
                    New password
                  </label>
                  <div className="mt-2">
                    <input
                      id="new-password"
                      name="new_password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                      }}
                      autoComplete="new-password"
                      className="block w-full rounded-md ring-gray-700 border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium leading-6 "
                  >
                    Confirm password
                  </label>
                  <div className="mt-2">
                    <input
                      id="confirm-password"
                      name="confirm_password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                      autoComplete="new-password"
                      className="block w-full rounded-md border-0 py-1.5 ring-gray-700 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {err?.confirmPassword && (
                    <p
                      className="mt-2 text-sm text-red-600 inline"
                      id="email-error"
                    >
                      {err?.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex">
                <button
                  type="button"
                  onClick={() => {
                    changePassword();
                  }}
                  className="rounded-md text-white bg-primary-600 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  {changingPassword ? <Spinner small center /> : "Save"}
                </button>
              </div>
            </form>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7 ">
                Delete account
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                No longer want to use our service? You can delete your account
                here. This action is not reversible. All information related to
                this account will be deleted permanently.
              </p>
            </div>

            <form className="flex items-start md:col-span-2">
              <button
                type="submit"
                className="rounded-md text-white bg-red-500 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-red-400"
              >
                Yes, delete my account
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

# This locust test script example will simulate a user
# authenticating with application restricted access
# and posting data to the ambulance analitycs proxy
import os
from common.auth.client_credentials import AuthClientCredentials
from locust import HttpUser, task, between


class AmbulanceAnaliticsClient(HttpUser):
    # we can assume some time between each task by uncomenting
    # wait_time = between(1, 5)

    def on_start(self):
        # assume each user authenticates with the same app
        auth = AuthClientCredentials(
            auth_url=os.environ["AUTH_URL"],
            private_key_file=os.environ["PRIVATE_KEY_PATH"],
            client_id=os.environ["CLIENT_ID"],
            aud=os.environ["AUD"],
            headers={"kid": "test-1"},
            alg="RS512"
        )
        apigee_token = auth.get_access_token()

        self.target_base_path = os.environ["TARGET_BASE_PATH"]
        self.headers = {
            "Authorization": "Bearer " + apigee_token,
        }

    @task()
    def ambulance_analitycs_api(self):
        # Each user will be performing the following post request...
        self.client.post(f"{self.target_base_path}/$process-message", headers=self.headers)
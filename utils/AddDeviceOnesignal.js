// CODE ADDED BY UDDIPAN
import axios from "axios";
const AddDeviceOnesignal = (params) => {
    return new Promise((resolve, reject) => {
        axios.post(`https://onesignal.com/api/v1/players`, {
            "external_user_id": params.id,
            "app_id": "38ab4702-b287-4200-bdcd-a717c01cbdc7",
            "identifier": params.pushToken,
            "language": "en",
            "game_version": "1.0",
            "device_type": 1,
        }, {
            headers: {
                "Authorization": `Basic NzUyZDJmNTItZjg5Ny00NjA1LTgyM2EtMGFlYWI0ZWNlYzZh`
            }
        }).then((resp) => {
            console.log(resp.data, "------>>");
            resolve(resp.data)
        }).catch(err => {
            console.log(err, "------>>");
            reject(err)
        })
    })
}
export default AddDeviceOnesignal;
// CODE ADDED BY UDDIPAN
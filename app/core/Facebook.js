import {GraphRequest, GraphRequestManager} from "react-native-fbsdk";
import Consts from "../consts/Consts";


export default class Facebook {
    static makeGraphRequest = (callback) => {
        let graphManager = new GraphRequestManager();
        let graphRequest = new GraphRequest("/me", Consts.API_URLS.FACEBOOK_URL, callback);
        graphManager.addRequest(graphRequest).start();
    };
}

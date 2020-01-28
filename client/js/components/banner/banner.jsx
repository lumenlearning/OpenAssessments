// Dependencies
import React, {Component}   from "react";
import moment from "moment";
import SettingsStore           from "../../stores/settings";
// Sub-Components
import WarningSvg           from "../common/svg/warning.svg.jsx";


export default class Banner extends Component {
    render() {
        // Banner takes a UTC datetime property formatted like so:
        // "2020-03-04T20:00:00"
        // for March 4, 2020, 20:00 UTC

        if (SettingsStore.current().maintenance_time) {
            let dt          = moment.utc(
                SettingsStore.current().maintenance_time,
                moment.ISO_8601
            );
            let date        = dt.format("MMMM D");
            let utcTime     = dt.format("H:mm z");
            let localTime   = moment(dt).local().format("h:mm A");
            let now = Date.now();
            const formatter = new Intl.DateTimeFormat(
                undefined,
                {timeZoneName: "short"}
            );
            let localTzObject = formatter.formatToParts(now).find(
                function(item) {
                    return item.type === "timeZoneName";
                }
            );
            let localTZ = localTzObject["value"];

            return (
                <div className="small-12 columns">
                    <div style={{border: "1px solid #F5A623",
                        borderRadius: "2px",
                        display: "flex",
                        marginBottom: "1.25rem",
                        marginTop: "1.25rem",
                        padding: "8px"}}
                    >
                        <WarningSvg
                        color="#F5A623"
                        width="24"
                        height="24"
                        />
                        <p style={{color: "#222", margin: "0 0 0 0.625rem"}}>
                            <strong>Maintenance:</strong>
                            &nbsp;This course will be down for an update {date} at {localTime} {localTZ} ({utcTime} ). Quiz attempts started or submitted during this time may be lost.
                        </p>
                    </div>
                </div>
            );
        } else {
            return (
                <div></div>
            );
        }
    }
}

import React from "react";
import { DisplayBox, ApiHelper, Helper, DonationInterface, UniqueIdHelper } from ".";
import { Link } from "react-router-dom"
import { Table } from "react-bootstrap";
import { PersonPaymentMethods } from "./PersonPaymentMethods";

interface Props { personId: string }

export const PersonDonations: React.FC<Props> = (props) => {
    const [donations, setDonations] = React.useState<DonationInterface[]>([]);
    const [gateway, setGateway] = React.useState(null);

    const loadData = () => {
        if (!UniqueIdHelper.isMissing(props.personId)) {
            ApiHelper.get("/donations?personId=" + props.personId, "GivingApi").then(data => setDonations(data));
            ApiHelper.get("/gateways", "GivingApi").then(data => setGateway(data));
        }
    }

    const getRows = () => {
        var rows: JSX.Element[] = [];

        if (donations.length === 0) {
            rows.push(<tr key="0">Donations will appear once a donation has been entered.</tr>);
            return rows;
        }

        for (let i = 0; i < donations.length; i++) {
            var d = donations[i];
            rows.push(
                <tr>
                    <td><Link to={"/donations/" + d.batchId}>{d.batchId}</Link></td>
                    <td>{Helper.formatHtml5Date(d.donationDate)}</td>
                    <td>{d.method}</td>
                    <td>{d.fund.name}</td>
                    <td>{Helper.formatCurrency(d.amount)}</td>
                </tr>
            );
        }
        return rows;
    }

    const getTableHeader = () => {
        const rows: JSX.Element[] = []

        if (donations.length > 0) {
            rows.push(<tr key="header"><th>Batch</th><th>Date</th><th>Method</th><th>Fund</th><th>Amount</th></tr>);
        }

        return rows;
    }

    React.useEffect(loadData, [props.personId]);

    return (
        <>
            <PersonPaymentMethods gateway={gateway} personId={props.personId}></PersonPaymentMethods>
            <DisplayBox headerIcon="fas fa-hand-holding-usd" headerText="Donations">
                <Table>
                    <thead>{getTableHeader()}</thead>
                    <tbody>{getRows()}</tbody>
                </Table>
            </DisplayBox>
        </>
    );
}


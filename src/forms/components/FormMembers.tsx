import React, { useState } from "react";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DisplayBox, PersonAdd, PersonInterface } from ".";
import { ApiHelper, MemberPermissionInterface, PersonHelper } from "../../helpers";
import { Grid } from "@mui/material"

interface Props { formId: string }

export const FormMembers: React.FC<Props> = (props) => {
  const [filterList, setFilterList] = useState<string[]>([]);
  const [formMembers, setFormMembers] = useState<MemberPermissionInterface[]>([]);

  const loadData = () => {
    ApiHelper.get("/memberpermissions/form/" + props.formId, "MembershipApi").then(results => {
      let filterMembers: string[] = [];
      results.forEach((member: MemberPermissionInterface) => filterMembers.push(member.memberId));
      setFilterList(filterMembers);
      setFormMembers(results);
    });
  }

  const addPerson = (p: PersonInterface) => {
    const newMember = {
      memberId: p.id,
      contentType: "form",
      contentId: props.formId,
      action: "view",
      personName: p.name.display
    };
    ApiHelper.post("/memberpermissions?formId=" + props.formId, [newMember], "MembershipApi").then(result => {
      let fm = [...formMembers];
      fm.push(result[0]);
      setFormMembers(fm);
    })
    updateFilterList(p.id, "add");
  }

  const handleActionChange = (personId: string, action: string) => {
    let member;
    let fm = [...formMembers];
    fm.map((p: MemberPermissionInterface) => {
      if (p.memberId === personId) {
        p.action = action;
        member = p;
      }
      return p;
    });
    ApiHelper.post("/memberpermissions?formId=" + props.formId, [member], "MembershipApi");
    setFormMembers(fm);
  }

  const handleRemoveMember = (personId: string) => {
    updateFilterList(personId, "remove");
    let fm = [...formMembers];
    fm = fm.filter((p: MemberPermissionInterface) => p.memberId !== personId);
    setFormMembers(fm);
    ApiHelper.delete("/memberpermissions/member/" + personId + "?formId=" + props.formId, "MembershipApi");
  }

  const getRows = () => {
    let rows: JSX.Element[] = [];
    formMembers.forEach(fm => {
      rows.push(
        <tr key={fm.memberId}>
          <td><Link to={"/people/" + fm.memberId}>{fm.personName}</Link></td>
          <td>
            <ButtonGroup size="sm">
              <Button variant={fm.action === "admin" ? "primary" : "outline-primary"} onClick={(e) => { handleActionChange(fm.memberId, "admin") }}>Admin</Button>
              <Button variant={fm.action === "view" ? "primary" : "outline-primary"} onClick={(e) => { handleActionChange(fm.memberId, "view") }}>View Only</Button>
            </ButtonGroup>
          </td>
          <td>{<a href="about:blank" onClick={(e) => { e.preventDefault(); handleRemoveMember(fm.memberId); }} className="text-danger"><i className="fas fa-user-times"></i> Remove</a>}</td>
        </tr>
      );
    });
    return rows;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    rows.push(<tr key="header"><th>Name</th><th>Permission</th><th>Action</th></tr>);
    return rows;
  }

  const getTable = () => (
    <Table id="formMembersTable">
      <thead>{getTableHeader()}</thead>
      <tbody>{getRows()}</tbody>
    </Table>
  );

  const updateFilterList = (id: string, action: string) => {
    let fl = [...filterList];
    if (action === "add") fl.push(id);
    if (action === "remove") fl = fl.filter(memberId => memberId !== id);
    setFilterList(fl);
  }

  React.useEffect(loadData, [props.formId]);

  return (
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox headerText="Form Members" headerIcon="fas fa-users">
          {getTable()}
        </DisplayBox>
      </Grid>
      <Grid item md={4} xs={12}>
        <DisplayBox headerText="Add Person" headerIcon="fas fa-users">
          <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={addPerson} filterList={filterList} />
        </DisplayBox>
      </Grid>
    </Grid>
  );
}

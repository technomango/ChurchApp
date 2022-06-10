import React from "react";
import { Tabs, ApiHelper, FormInterface, MemberPermissionInterface, UserHelper } from "./components";
import { useParams } from "react-router-dom"
import { Icon } from "@mui/material";

export const FormPage = () => {
  const params = useParams();
  const [form, setForm] = React.useState<FormInterface>({} as FormInterface);
  const [memberPermission, setMemberPermission] = React.useState<MemberPermissionInterface>({} as MemberPermissionInterface);
  const loadData = () => {
    ApiHelper.get("/forms/" + params.id, "MembershipApi").then(data => {
      setForm(data);
      if (data.contentType === "form") ApiHelper.get("/memberpermissions?memberId=" + UserHelper.person.id + "&formId=" + params.id, "MembershipApi").then(results => setMemberPermission(results));
    });
  }

  React.useEffect(loadData, []); //eslint-disable-line

  return form?.id ?
    <>
      <h1><Icon>list_alt</Icon> {form.name}</h1>
      <Tabs form={form} memberPermission={memberPermission} />
    </>
    : <></>;
}

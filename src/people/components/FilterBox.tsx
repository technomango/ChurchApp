import React, {useState, useEffect} from "react";
import { PeopleSearchResults, ApiHelper, DisplayBox, ExportLink, PeopleColumns, FilterDropDown, PeopleColumnsDropDown, SingleSelectDropDown } from "./";
import { FormControl, Button } from "react-bootstrap";

interface Props {
  columns: {
    key: string;
    label: string;
    shortName: string;
    type: string;
}[]
}

type FilterCriteria = {
    field: string;
    operator: string;
    criteria: string;
  }

const emptyFilter = {
  field: "",
  operator: "",
  criteria: ""
}

export const FilterBox = ({ columns }: Props) => {
  const [filterArray, setFilterArray] = useState<FilterCriteria[]>([emptyFilter]);

  const updateFilterArrayField = (field: string, index: number) => {
    let items = [...filterArray];
    let filterToUpdate = {
      ...items[index],
      field
    }
    items[index] = filterToUpdate;
    setFilterArray(items)
  }
  const updateFilterArrayOperator = (operator: string, index: number) => {
    let items = [...filterArray];
    let filterToUpdate = {
      ...items[index],
      operator
    }
    items[index] = filterToUpdate;
    setFilterArray(items)
  }
  const updateFilterArrayCriteria = (criteria: string, index: number) => {
    let items = [...filterArray];
    let filterToUpdate = {
      ...items[index],
      criteria
    }
    items[index] = filterToUpdate;
    setFilterArray(items)
  }

  const handleAddFilter = () => {
    setFilterArray([...filterArray, emptyFilter])
  }

  const handleSubmitFilters = () => {
    const query = buildQueryString();
    console.log(query)
    ApiHelper.get("/people" + query, "MembershipApi").then(data => {
      console.log(data)
    });
  }
  const buildQueryString = () => {
    let query = "?"
    filterArray.forEach((filter, i) => {
      if(i > 0)query += "&"
      if(filter.operator === "NULL" || filter.operator === "NOT_NULL"){
        query += filter.field + `[${filter.operator}]`;
      }else{
        query += filter.field + `[${filter.operator}]=` +  filter.criteria;
      }
    })
    return query;
  }

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSubmitFilters(); } }

  return (
    <DisplayBox headerIcon="fas fa-filter" headerText="Filter">
      {filterArray.map((filter, i) => (
        <>
          {i > 0 && <p>AND</p>}
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop:10, marginBottom:10}}>
            <SingleSelectDropDown toggleColumn={updateFilterArrayField} items={columns} selectedItem={filterArray[i].field} index={i} />
            <FilterDropDown toggleColumn={updateFilterArrayOperator} paramType={columns.find(col => col.key === filterArray[i].field)?.type} selectedOperator={filterArray[i].operator} index={i} />
            {(filterArray[i].operator !== "NULL" && filterArray[i].operator !== "NOT_NULL") ? <FormControl id="searchText" aria-label="searchBox" name="searchText" type="text" placeholder="Filter criteria" value={filterArray[i].criteria} onChange={(e) => updateFilterArrayCriteria(e.currentTarget.value, i)} onKeyDown={handleKeyDown} style={{maxWidth: 100}} /> : <span style={{width: 100}}></span>}
          </div>
        </>
      ))}
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 50}}>
        <Button id="searchButton" variant="primary" onClick={handleAddFilter}>Add Filter</Button>
        <Button id="searchButton" variant="warning" onClick={handleAddFilter}>Clear All</Button>
        <Button id="applyButton" variant="success" onClick={handleSubmitFilters}>Apply</Button>
      </div>
    </DisplayBox>
  )
}

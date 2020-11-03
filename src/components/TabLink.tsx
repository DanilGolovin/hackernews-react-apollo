import React, { FunctionComponent } from 'react'
import { Link } from "react-router-dom";
import { Tab } from "@material-ui/core";
import '../styles/index.css'

type TabLinkProps = {
    label: string,
    path: string
}
const TabLink: FunctionComponent<TabLinkProps> = ({label, path}) => {
    return (
        <Tab label={label}
             className="tab-link"
             component={Link}
             to={path}
        />
    )
}
export default TabLink
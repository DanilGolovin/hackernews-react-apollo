import React from 'react'
import { Link } from "react-router-dom";
import { Tab } from "@material-ui/core";
import '../styles/index.css'

const TabLink = ({label, path}) => {
    return (
        <Tab label={label}
             className="tab-link"
             component={Link}
             to={path}
        />
    )
}
export default TabLink
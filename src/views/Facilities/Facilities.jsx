
import React from "react";
import Select from "react-select";
import 'react-dropdown/style.css';
import axios from "axios";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from "reactstrap";
import { PanelHeader } from "components";
import ReactTable from "react-table";
import 'react-table/react-table.css'

// const fetchData = require("../../api");
const token = require('variables/keys.json');


const options = require('variables/counties_of_Kenya.json');
const baseURL = "http://api.kmhfltest.health.go.ke";
const subCountyEndPoint = "common/sub_counties";


class Facilities extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            countyOptions: null,
            subCountyOptions: [],
            wardOptions: [],
            serviceOptions: [],
            tableData: []
        }
    }

    componentDidMount() {
        //get  subcounty options
        axios.get(`${baseURL}/api/${subCountyEndPoint}/?fields=name,code,id&format=json&page_size=300`, {
            headers:
                { Authorization: `Bearer ${token.accessToken}` }
        }).then((response) => {
            const subCountyOptions = response.data.results.map(response => {
                return ({
                    label: `${response.name}`,
                    value: parseInt(`${response.code}`, 10),
                    id: `${response.id}`
                })
            });
            console.log(subCountyOptions);
            this.setState({ subCountyOptions });
        })
            .catch((error) => {
                console.log(error);
            })
        //get  ward options
        axios.get(`${baseURL}/api/common/wards/?fields=name,code&format=json&page_size=1600`, {
            headers:
                { Authorization: `Bearer ${token.accessToken}` }
        }).then((response) => {
            const wardOptions = response.data.results.map(response => {
                return ({
                    label: `${response.name}`,
                    value: parseInt(`${response.code}`, 10)
                })
            });
            console.log(wardOptions);
            this.setState({ wardOptions });
        })
            .catch((error) => {
                console.log(error);
            })
        //get services options
        axios.get(`${baseURL}/api/facilities/service_categories/?fields=name,id&format=json&page_size=100`, {
            headers:
                { Authorization: `Bearer ${token.accessToken}` }
        }).then((response) => {
            const serviceOptions = response.data.results.map(response => {
                return ({
                    label: `${response.name}`,
                    value: `${response.id}`
                })
            });
            console.log(serviceOptions);
            this.setState({ serviceOptions });
        })
            .catch((error) => {
                console.log(error);
            })
        //get search results

    }

    handleFilterChange = (tableData) => {
        this.setState({ tableData });
    }

    handleCountyChange = (countyOptions) => {
        this.setState({ countyOptions });
        console.log(`County selected:`, countyOptions);
    }
    handleSubCountyChange = (subCountyOptions) => {
        console.log(subCountyOptions);
        this.setState({ subCountyOptions });
        console.log(`Sub-County selected:`, subCountyOptions);
    }
    handleWardChange = (wardOptions) => {
        this.setState({ wardOptions });
        console.log(`Ward selected:`, wardOptions);
    }
    handleServiceChange = (serviceOptions) => {
        this.setState({ serviceOptions });
        console.log(`Ward selected:`, serviceOptions);
    }


    render() {
        const { countyOptions } = this.state;
        const { subCountyOptions } = this.state;
        const { wardOptions } = this.state;
        const { serviceOptions } = this.state;
        const { tableData } = this.setState;
        return (
            <div>
                <PanelHeader size="sm" />
                <div className="content">
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Registered Facilities</CardTitle>
                                    <Row>
                                        <Col xs={12} md={3}>
                                            <Select
                                                value={countyOptions}
                                                onChange={this.handleCountyChange}
                                                options={options.counties}
                                                placeholder="Select County"
                                            />
                                        </Col>
                                        <p></p>
                                        <Col xs={12} md={3}>
                                            <Select
                                                onChange={this.handleSubCountyChange}
                                                options={subCountyOptions}
                                                placeholder="Select Sub-County"
                                            />
                                        </Col>
                                        <p></p>
                                        <Col xs={12} md={3}>
                                            <Select
                                                onChange={this.handleWardChange}
                                                options={wardOptions}
                                                placeholder="Select Ward"
                                            />
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <Select
                                                isDIsabled={true}
                                                onChange={this.handleServiceChange}
                                                options={serviceOptions}
                                                placeholder="Select Service"
                                            />
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <ReactTable                                        
                                        onFetchData={(state, instance) => {
                                            const selectedSubCounty = "70d7bb84-cee4-411a-800e-d134bded1234";
                                            this.setState({ loading: true })
                                            axios.get(`${baseURL}/api/facilities/facilities/?sub_county=${selectedSubCounty}&fields=official_name,county_name,facility_type_name&format=json&page_size=12000`, {
                                                headers:
                                                    { Authorization: `Bearer ${token.accessToken}` }
                                            }).then((response) => {
                                                const tableData = response.data.results.map(response => {
                                                    return ({
                                                        facilityName: `${response.official_name}`,
                                                        location: `${response.county_name}`,
                                                        type: `${response.facility_type_name}`
                                                    })
                                                });
                                                console.log(tableData);
                                                this.setState({ tableData });
                                            })
                                                .catch((error) => {
                                                    console.log(error);
                                                })
                                        }}
                                        data={this.state.tableData}
                                        columns={[{
                                            Header: 'Facility Name',
                                            accessor: 'facilityName' // String-based value accessors!
                                        }, {
                                            Header: 'Location',
                                            accessor: 'location',
                                        }, {
                                            Header: 'Type',
                                            accessor: 'type'
                                        }
                                        ]}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Facilities;
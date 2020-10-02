import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import { Box, TextField, Button, MenuItem } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";
import CommonTable from "../components/table/commonTable";
import Autocomplete from '@material-ui/lab/Autocomplete';
import PageHeading from "../components/PageHeading";
import { getCurrentMonthFromToDates, getLastMonthFromToDates, getLastThreeMonthsFromToDates, getLastYearFromToDates, getTransactionsFilterOptions, getYearToDateFromToDates } from "../assets/commonAssets";
import { parse, isWithinInterval } from "date-fns";

const headCells = [
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant" },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit Ref/Number" },
    { id: "charge_label", numeric: false, disablePadding: true, label: "Charge Name/Type" },
    { id: "charge_date", numeric: false, disablePadding: true, label: "Charge Date", },
    { id: "due_date", numeric: false, disablePadding: true, label: "Due Date", },
    { id: "charge_amount", numeric: false, disablePadding: true, label: "Charge Amount", },
];

const TRANSACTIONS_FILTER_OPTIONS = getTransactionsFilterOptions()

let TenantStatementsPage = ({
    transactionsCharges,
    contacts,
    classes
}) => {
    const [tenantChargesItems, setTenantChargesItems] = useState([]);
    const [filteredChargeItems, setFilteredChargeItems] = useState([]);
    const [contactFilter, setContactFilter] = useState(null);
    const [periodFilter, setPeriodFilter] = useState('month-to-date');
    const [fromDateFilter, setFromDateFilter] = useState("");
    const [toDateFilter, setToDateFilter] = useState("");
    const [chargeType, setChargeTypeFilter] = useState("");
    const [selected, setSelected] = useState([]);
    const CHARGE_TYPES = Array.from(new Set(transactionsCharges
        .map((chargeItem) => (JSON.stringify({ label: chargeItem.charge_label, value: chargeItem.charge_type })))))
        .map(chargeType => JSON.parse(chargeType))

    const totalRentCharges = filteredChargeItems.filter(charge => charge.charge_type === 'rent')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.charge_amount) || 0
        }, 0)

    const totalOtherCharges = filteredChargeItems.filter(charge => charge.charge_type !== 'rent')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.charge_amount) || 0
        }, 0)

    const totalRentPayments = filteredChargeItems.filter(payment => payment.charge_type === 'rent')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.payed_amount) || 0
        }, 0)

    const totalOtherPayments = filteredChargeItems.filter(payment => payment.charge_type !== 'rent')
        .reduce((total, currentValue) => {
            return total + parseFloat(currentValue.payed_amount) || 0
        }, 0)

    useEffect(() => {
        setTenantChargesItems(transactionsCharges);
        setFilteredChargeItems(transactionsCharges);
    }, [transactionsCharges]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the transactionsCharges according to the search criteria here
        let filteredStatements = tenantChargesItems
        let dateRange = []
        let startOfPeriod;
        let endOfPeriod;
        if (periodFilter) {
            switch (periodFilter) {
                case 'last-month':
                    dateRange = getLastMonthFromToDates()
                    startOfPeriod = dateRange[0]
                    endOfPeriod = dateRange[1]
                    break;
                case 'year-to-date':
                    dateRange = getYearToDateFromToDates()
                    startOfPeriod = dateRange[0]
                    endOfPeriod = dateRange[1]
                    break;
                case 'last-year':
                    dateRange = getLastYearFromToDates()
                    startOfPeriod = dateRange[0]
                    endOfPeriod = dateRange[1]
                    break;
                case 'month-to-date':
                    dateRange = getCurrentMonthFromToDates()
                    startOfPeriod = dateRange[0]
                    endOfPeriod = dateRange[1]
                    break;
                case '3-months-to-date':
                    dateRange = getLastThreeMonthsFromToDates()
                    startOfPeriod = dateRange[0]
                    endOfPeriod = dateRange[1]
                    break;
            }
            filteredStatements = filteredStatements.filter((chargeItem) => {
                const chargeItemDate = parse(chargeItem.charge_date, 'yyyy-MM-dd', new Date())
                return isWithinInterval(chargeItemDate, { start: startOfPeriod, end: endOfPeriod })
            })
        }
        filteredStatements = filteredStatements.filter(({ charge_type }) =>
            !chargeType ? true : charge_type === chargeType
        )
        setFilteredChargeItems(filteredStatements);
    };

    const resetSearchForm = (event) => {
        event.preventDefault();
        setFilteredChargeItems(tenantChargesItems);
        setChargeTypeFilter("");
        setPeriodFilter('');
        setContactFilter("");
        setFromDateFilter("");
        setToDateFilter("");
    };

    return (
        <Grid
            container
            spacing={3}
            justify="center" direction="column"
        >
            <Grid item key={2}>
                <PageHeading paddingLeft={2} text={"Tenants Charges Statement"} />
            </Grid>
            <Grid
                container
                spacing={2}
                item
                alignItems="center"
                direction="row"
                key={1}
            >
                <Grid item>
                    <PrintArrayToPdf
                        disabled={selected.length <= 0}
                        reportName={'Tenants Payments Records'}
                        reportTitle={'Tenants Payments Data'}
                        headCells={headCells}
                        dataToPrint={tenantChargesItems.filter(({ id }) => selected.includes(id))}
                    />
                </Grid>
                <Grid item>
                    <ExportToExcelBtn
                        disabled={selected.length <= 0}
                        reportName={'Tenants Charges Records'}
                        reportTitle={'Tenants Charges Records'}
                        headCells={headCells}
                        dataToPrint={tenantChargesItems.filter(({ id }) => selected.includes(id))}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Box
                    border={1}
                    borderRadius="borderRadius"
                    borderColor="grey.400"
                >
                    <form
                        className={classes.form}
                        id="contactSearchForm"
                        onSubmit={handleSearchFormSubmit}
                    >
                        <Grid
                            container
                            spacing={2}
                            justify="center"
                            direction="row"
                        >
                            <Grid
                                container
                                item
                                xs={12} lg={6}
                                spacing={1}
                                justify="center"
                                direction="row"
                            >
                                <Grid item xs={12} lg={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="date"
                                        id="from_date_filter"
                                        name="from_date_filter"
                                        label="From Date"
                                        value={fromDateFilter}
                                        onChange={(event) => {
                                            setFromDateFilter(
                                                event.target.value
                                            );
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="date"
                                        name="to_date_filter"
                                        label="To Date"
                                        id="to_date_filter"
                                        onChange={(event) => {
                                            setToDateFilter(event.target.value);
                                        }}
                                        value={toDateFilter}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    variant="outlined"
                                    name="chargeType"
                                    label="Charge Type"
                                    id="chargeType"
                                    onChange={(event) => {
                                        setChargeTypeFilter(
                                            event.target.value
                                        );
                                    }}
                                    value={chargeType}
                                >
                                    {CHARGE_TYPES.map(
                                        (charge_type, index) => (
                                            <MenuItem
                                                key={index}
                                                value={charge_type.value}
                                            >
                                                {charge_type.label}
                                            </MenuItem>
                                        )
                                    )}
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            spacing={2}
                            justify="center"
                            direction="row"
                        >
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    select
                                    id="period_filter"
                                    name="period_filter"
                                    label="Period"
                                    value={periodFilter}
                                    onChange={(event) => {
                                        setPeriodFilter(
                                            event.target.value
                                        );
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                >
                                    {TRANSACTIONS_FILTER_OPTIONS.map((filterOption, index) => (
                                        <MenuItem
                                            key={index}
                                            value={filterOption.id}
                                        >
                                            {filterOption.text}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Autocomplete
                                    id="contact_filter"
                                    options={contacts}
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    name="contact_filter"
                                    onChange={(event, newValue) => {
                                        setContactFilter(newValue);
                                    }}
                                    value={contactFilter}
                                    getOptionLabel={(tenant) => tenant ? `${tenant.first_name} ${tenant.last_name}` : ''}
                                    style={{ width: "100%" }}
                                    renderInput={(params) => <TextField {...params} label="Tenant" variant="outlined" />}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            spacing={2}
                            item
                            justify="flex-end"
                            alignItems="center"
                            direction="row"
                            key={1}
                        >
                            <Grid item>
                                <Button
                                    onClick={(event) => handleSearchFormSubmit(event)}
                                    type="submit"
                                    form="contactSearchForm"
                                    color="primary"
                                    variant="contained"
                                    size="medium"
                                    startIcon={<SearchIcon />}
                                >
                                    SEARCH
                                    </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={(event) => resetSearchForm(event)}
                                    type="reset"
                                    form="contactSearchForm"
                                    color="primary"
                                    variant="contained"
                                    size="medium"
                                    startIcon={<UndoIcon />}
                                >
                                    RESET
                                    </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <CommonTable
                    selected={selected}
                    setSelected={setSelected}
                    rows={filteredChargeItems}
                    headCells={headCells}
                    noEditCol
                    noDeleteCol
                />
            </Grid>
        </Grid>
    );
};


export default TenantStatementsPage;
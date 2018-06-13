import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { List } from "react-virtualized";
import { Field, reduxForm, focus, change } from 'redux-form'
import axios from 'axios';
import {
    FETCH_DATA
} from './actionTypes';

const form = 'currency_converter';

const mapStateToProps = state =>  state;
const mapDispatchToProps = dispatch => ({
    onFetchData: ( data ) => {
        dispatch({ type: FETCH_DATA, payload: data })
    },
    onFocusField: ( field ) => {
        dispatch( focus( form, field ) )
    },
    onBlurField: () => {
        dispatch( focus( form, undefined ) );
        dispatch( focus( form, 'total' ) )
    },
    onSelectCurrency: ( field, value ) => {
        dispatch( change( form, field, value ));
    },
    onCalculate: ( total ) => {
        dispatch( change( form, 'total', total ));
    }
});

class ConvertForm extends Component {
    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
        this.onSelectCurrency = this.onSelectCurrency.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentWillMount () {
        this.fetchData()
    }
    onSelectCurrency = (field, value) => {
        this.props.onSelectCurrency(field, value);
        this.props.onBlurField();
    }
    fetchData = async () => {
        axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=0')
            .then( res => this.props.onFetchData(res.data) );
    }
    onSubmit = async (event) => {
        event.preventDefault();

        const req = this.fetchData();
        const convert = ( amount, input, output ) => {
            const data = this.props.currencys.data;
            const rateInUsd = data.filter( i => i.id === input )[0].price_usd;
            const rateOutUsd = data.filter( i => i.id === output )[0].price_usd;

            return parseFloat(rateInUsd) * parseFloat(amount) / parseFloat(rateOutUsd);
        }
         await req.then(()=>{
                const amount = this.props.formData[form].values.amount;
                const inputCurrency = this.props.formData[form].values.sourceCurrency;
                const outputCurrency = this.props.formData[form].values.targetCurrency;
                const convertedAmount = convert(amount, inputCurrency, outputCurrency)
                this.props.onCalculate(convertedAmount);
            }
        )

    }
  render () {
      const currencysData = ( this.props.currencys && this.props.currencys.data ) ? this.props.currencys.data : [];
      const activeField = this.props.formData[form] ? this.props.formData[form].active : null;
      const isBlured = !!( this.props.formData[form] && this.props.formData[form].fields && this.props.formData[form].fields.undefined && this.props.formData[form].fields.undefined.active );
      const values = this.props.formData[form] ? this.props.formData[form].values : null;
      const totalAmount = this.props.formData[form] ? this.props.formData[form].values.total : null;

      return (
        <div>
            <form onSubmit={this.onSubmit}>
                <div className="container__inner">
                    <label htmlFor="amount">FROM</label>
                    <Field
                        name="amount"
                        component={AmountInput}
                    />
                    <CurrencySelectField
                        name="currencySource"
                        activeField={activeField}
                        formValues={values}
                        isBlured={isBlured}
                        onFocusField={this.props.onFocusField}
                        onBlurField={this.props.onBlurField}
                        onClickOption={this.onSelectCurrency}
                        data={currencysData}
                    />
                    <label htmlFor="currencyTarget">TO</label>
                    <CurrencySelectField
                        name="currencyTarget"
                        activeField={activeField}
                        formValues={values}
                        isBlured={isBlured}
                        onFocusField={this.props.onFocusField}
                        onBlurField={this.props.onBlurField}
                        onClickOption={this.onSelectCurrency}
                        data={currencysData}
                    />
                    <span>=</span>
                    <Field
                        name="total"
                        component={AmountInput}
                        totalValue={totalAmount}
                    />
                    <Button
                        type="submit"
                    >Submit</Button>
                </div>
            </form>
        </div>

    )
  }
}
ConvertForm = connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'currency_converter',
    initialValues: { sourceCurrency: "bitcoin", targetCurrency: "ethereum" }
})(ConvertForm));

class AmountInput extends Component {
    render () {
        const { input: { onChange, onFocus, onBlur }, totalValue } = this.props;
        const totalAmount = this.props.input.name === 'total' ? {value: totalValue || ''} : {};
        return (
            <TextField
                className="input_amount"
                type="number"
                name={this.props.input.name}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
                {...totalAmount}
            />
        )
    }
}

class CurrencySelectField extends Component {
    constructor(props) {
        super(props);
    }
    render () {
        const name = this.props.name;
        const value = () => {
            if ( this.props.formValues && this.props.formValues[name] ) {
                return this.props.formValues[name]
            } else if (!!value && name === 'currencySource') {
                return 'bitcoin'
            } else if (!!value && name === 'currencyTarget') {
                return 'ethereum'
            } else { return '' }
        }
        return (
            <Field
                name={name}
                component={CurrencySelect}
                isActive={this.props.activeField === this.props.name}
                isBlured={this.props.isBlured}
                id={name}
                fieldValue={value()}
                onFocusField={this.props.onFocusField}
                onBlurField={this.props.onBlurField}
                onClickOption={this.props.onClickOption}
                data={this.props.data}
            />
        )
    }
}
class CurrencySelect extends Component {
    constructor(props) {
        super(props);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }
    onBlur = () => {
        this.props.onBlurField(this.props.input.name)
    }
    onFocus = (event) => {
        if (this.props.isBlured) {
            event.preventDefault();
            return false
        }
        this.props.onFocusField(this.props.input.name)
    }
    render () {
        const value = this.props.fieldValue ? this.props.fieldValue : '';
        const selected = this.props.data.filter((i)=>{ return i.id === value})[0];
        return (
            <Select
                className="input_currency"
                open={this.props.isActive}
                onOpen={this.onFocus}
                onClose={this.onBlur}
                inputProps={{value: value}}
                displayEmpty={true}
                renderValue={()=><span>{ selected ? selected.name : '' }</span>}
            >
                <OptionsList
                    id={this.props.input.name}
                    onClickOption={this.props.onClickOption}
                    data={this.props.data}
                />
            </Select>
        )
    }
}
class OptionsList extends Component {
    constructor(props) {
        super(props);
        this.rowRenderer = this.rowRenderer.bind(this);
    }
    rowRenderer = (row) => {
        const { key, index, style } = row;
        const option = this.props.data[index];
        const onClick = () => {
            this.props.onClickOption( this.props.id, option.id );
        }
        return (
            <MenuItem
                key={key}
                value={option.id}
                style={{
                    ...style,
                    paddingTop: "0",
                    paddingBottom: "0"
                }}
                onClick={onClick}
            >
                <div>{option.name}</div>
            </MenuItem>
        );
    };
    render () {
        return (
            <List
                width={200}
                height={500}
                style={{outline: 'none'}}
                rowCount={this.props.data.length}
                rowHeight={40}
                rowRenderer={this.rowRenderer}
            />
        )
    }
}

class App extends Component {
  render() {
      return (
          <Paper className='container'>
              <AppBar position="static" color="default" >
                <h3>Crypto-currency converter</h3>
              </AppBar>
              <ConvertForm/>
          </Paper>
        );
    }
}

export default App;

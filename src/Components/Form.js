import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, focus, change } from 'redux-form';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import {
    FETCH_DATA
} from '../actionTypes';
import AmountInput from './Input';
import CurrencySelectField from './SelectField'

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

export default ConvertForm;
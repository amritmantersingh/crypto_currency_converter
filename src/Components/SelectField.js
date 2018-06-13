import React, { Component } from 'react';
import CurrencySelect from './Select';
import { Field } from 'redux-form';

export default class CurrencySelectField extends Component {
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

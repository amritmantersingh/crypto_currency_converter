import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

export default class AmountInput extends Component {
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
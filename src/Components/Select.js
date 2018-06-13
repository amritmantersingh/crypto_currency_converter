import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import OptionsList from './OptionsList'

export default class CurrencySelect extends Component {
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
import React, { Component } from 'react';
import { List, AutoSizer } from "react-virtualized";
import MenuItem from '@material-ui/core/MenuItem';


export default class OptionsList extends Component {
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
            <AutoSizer disableHeight>
                {({ width }) => (
                    <List
                        width={width}
                        height={500}
                        style={{outline: 'none'}}
                        rowCount={this.props.data.length}
                        rowHeight={40}
                        rowRenderer={this.rowRenderer}
                    />
                )}
            </AutoSizer>
        )
    }
}
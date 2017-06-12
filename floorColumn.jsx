/* global _ Brackets TIU Random */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// column container diplaying list of brackets for a specific ring
class FloorColumn extends React.Component {

    constructor(props) {
        super(props);
        this.state = { animating: false };

        this.handleClick = this.handleClick.bind(this);
        this.animationComplete = this.animationComplete.bind(this);
    }

    componentDidMount() {
        this.columnDiv.addEventListener('animationend', this.animationComplete);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.selected && nextProps.selected){
            const state = this.state;
            state.animating = true;
            this.setState(state);
        }
    }

    componentWillUnmount() {
        this.columnDiv.removeEventListener('animationend', this.animationComplete);
    }

    animationComplete(){
        const state = this.state;
        state.animating = false;
        this.setState(state);
    }

    handleClick(event) {
        event.stopPropagation();
        this.props.columnClick(this.props.ringNum);
    }

    columnBrackets() {
        return _.filter(this.props.brackets, function (b){
            if (b.bracketStatus === TIU.BracketStatus.Pending ||
                b.bracketStatus === TIU.BracketStatus.Active){
                return b;
            }
            return false;
        });
    }

    columnClass() {

        let classname = 'floorColumn radius5';

        if (this.props.ringNum === 0){
            classname = `${classname} lightGrayBackground`;
        }

        if (this.props.selected === true) {
            classname = `${classname} floorColumnSelected`;
        }

        if (this.state.animating === true){
            classname = `${classname} animated zoomIn greenBG`;
        }

        return classname;
    }

    ringNum() {
        return this.props.ringNum === 0 ? 'U' : this.props.ringNum;
    }

    renderBrackets() {

        const items = [];

        // let key = 0;

        const bracketComps = this.props.bracketCompetitors;
        const clickHandler = this.props.bracketClick;

        this.columnBrackets().forEach(function (b){
            const comps = bracketComps(b._id);
            const key = b._id;
            // the bracket key must be the bracket id - a known id that does not change
            // cant be random id - otherwise bracket click animation breaks
            items.push(<TIU.Components.BracketItem
                key={b._id}
                bracket={b}
                bracketComps={comps}
                handleClick={clickHandler}
            />
            );
            // i += 1;
        });

        return items;
    }

    render() {

        return (
            <div
                data-ring={this.props.ringNum}
                data-type="column"
                className={this.columnClass()}
                onClick={this.handleClick}
                ref={(ref) => {
                    this.columnDiv = ref;
                }}

            >
                <TIU.Components.ColumnHeader
                    ringNum={this.props.ringNum}
                    brackets={this.columnBrackets()}
                />
                <div className="fullWidth bracketWrapper">
                    {this.renderBrackets()}
                </div>
            </div>
        );
    }
}

FloorColumn.propTypes = {
    ringNum: PropTypes.number.isRequired, // the ring to be displayed in this column
    brackets: PropTypes.array.isRequired, // current brackets
    bracketCompetitors: PropTypes.func.isRequired, // full competitors callback
    columnClick: PropTypes.func.isRequired,
    bracketClick: PropTypes.func.isRequired,
    selected: PropTypes.bool
};

FloorColumn.defaultProps = {
    selected: false
};

module.exports = FloorColumn;

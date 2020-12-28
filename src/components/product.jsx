import React, {Component} from 'react';
import Button from "react-bootstrap/Button";

class Product extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <span>{this.props.product.name}</span>
                <Button onClick={()=>this.props.onBuy(this.props.product)} disabled={this.props.product.selected}>Buy</Button>
            </div>
        );
    }
}

export default Product;

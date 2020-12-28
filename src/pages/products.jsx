import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Product from "../components/product";

class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [
                {_id:1, name:"krem", value:0, stock:10,selected:false},
                {_id:2, name:"gashti", value:0, stock:10,selected:false},
                {_id:3, name:"sutien", value:0, stock:10,selected:false},
            ],
            basket: []
        }
    }

    handleBuy = (product) =>{
        const products = [...this.state.products];
        const index = products.indexOf(product);
        products[index] = {...product};
        products[index].selected = true;
        const basket = [...this.state.basket];
        basket.push(product);
        this.setState({basket,products});
        sessionStorage.setItem("basket",JSON.stringify(basket));
        console.log(basket);
  }


    render() {
        return (
            <div>
                <Container>
                    <h1>products working!</h1>
                    {this.state.products.map(product => {
                        return(
                            <Product key={product._id} product={product} onBuy={this.handleBuy}/>
                        )
                    })}
                </Container>
            </div>
        );
    }
}

export default Products;

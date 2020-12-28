import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

class Basket extends Component {
   constructor(props) {
       super(props);
       this.state = {
           basket:[]
       }
   }

   componentDidMount() {
       const basket = JSON.parse(sessionStorage.getItem("basket"));
       this.setState({basket});
   }

   handleIncrement = (product) =>{
       const basket= [...this.state.basket];
       const index = basket.indexOf(product);
       basket[index] = {...product};
       basket[index].value++;
       this.setState({basket});
   }

   handleDecrement = (product) =>{
       const basket= [...this.state.basket];
       const index = basket.indexOf(product);
       basket[index] = {...product};
       basket[index].value--;
       this.setState({basket});
   }

    render() {
        return (
            <div>
                <Container>
                    {this.state.basket.map(bsk => {
                        return(
                            <div key={bsk._id}>
                            <h4>{bsk.name}</h4>
                            <h4>{bsk.value}</h4>
                                <Button onClick={()=>this.handleIncrement(bsk)}>Increment</Button>
                                <Button onClick={()=>this.handleDecrement(bsk)}>Decrement</Button>
                            </div>
                        )
                    })}
                </Container>
            </div>
        );
    }
}

export default Basket;

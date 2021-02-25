import React, {Component} from 'react';

class AllCommentsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: []
        }
    }
    render() {
        return (
            <div>
                Comments List Working
            </div>
        );
    }
}

export default AllCommentsList;

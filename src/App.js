import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { keywordsGenerator } from './ML/Model'

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modelLoaded: false,
            predictedWords: []
        }
        this.inputText = React.createRef();
        this.ratio = React.createRef();
    }

    componentDidMount() {
        let x = keywordsGenerator.loadClassifier().then(() => {
            this.setState({modelLoaded: true})
        });
    }


    render() {
        return (
            <div style={{margin: '30px', minHeight: '600px'}} className="jumbotron">
                <h1 className="display-3">Tags Extractor</h1>
                <p className="lead">This application is made by Mohamed Maher, as a test for the npm library
                    'ml-keywords-extractor'.</p>
                <hr className="my-4"/>
                <p>Enter the article you want to extract Tags from and press Understand.</p>
                <div className="form-group">
                    <label htmlFor="exampleTextarea">Enter an article</label>
                    <textarea ref={this.inputText} className="form-control" id="exampleTextarea" rows="3"/>
                </div>
                <p style={{display: 'flex'}} className="lead">
                    <a className="btn btn-primary btn-lg" href="#" onClick={this.predict} role="button">Understand</a>
                    <div style={{margin:'auto', marginLeft: '20px'}} className="form-group">
                        <input ref={this.ratio} style={{width: '150px'}} type="number" className="form-control" placeholder="Accuracy ratio" id="inputDefault" />
                    </div>

                </p>
                {this.state.predictedWords}
            </div>
        );
    }

    predict = () => {
        if (this.state.modelLoaded) {
            let allTags = [];
            keywordsGenerator.predict(this.inputText.current.value, this.ratio.current.value).then((predictions) => {
                predictions.forEach((pred, i) => {
                    allTags.push(<span key={i}><h4> {pred} </h4></span>)
                })
                this.setState({predictedWords: allTags});
            })

        } else {
            alert('loading ...');
        }
    }
}


export default App;

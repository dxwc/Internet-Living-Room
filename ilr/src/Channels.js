import React, { Component } from 'react';

const url = "/channels";

function Channel(props){
  return (
    <div className="row border border-dark rounded text-center">
    <div className="col-sm">
      <p>host:{props.host}</p>
      <a href={props.id}>enter</a>
      <p>description:{props.description}</p>
    </div>
    </div>);
}

class Channels extends Component {
  constructor(props){
    super(props);
    this.state = ({
      loaded: false,
      channels: [],
    });
  }
  componentDidMount(){
     fetch(url, {
        method: "GET",

     })
    .then((response)=>{
      if(response.ok){
        return response.json();
      } else {
        return [];
      }
    }).then((jsonResponse) =>{
      console.log(jsonResponse.channel);
      console.log(jsonResponse);

      if(jsonResponse === undefined){
      } else {
          //console.log("test")
          //console.log(jsonResponse.channel.map());
          const channelsExisted = jsonResponse.channel.map((channel) => {
          //console.log(channel.id);
          return <Channel className="channel" id={channel.id} 
          host={channel.host} description={channel.description} />
        });
        this.setState({
          channels: channelsExisted,
          loaded: true
        });
        //console.log(channelsExisted);
      }
    }).catch((err) => {
      this.setState({
        channels: [],
      });
    });
    //console.log(this.state.loaded);
  }
  render(){
  return (
    <div className = "container">
    {this.state.loaded?this.state.channels:null}
    </div>
    );
  }
}

export default Channels;
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import { invoke } from '@forge/bridge';
import CreateIssueModal from './CreateIssueModal'
import "../styles.css";
export default class Calendar extends React.Component {
  calendarComponentRef = React.createRef();

  state = {
    calendarWeekends: true,
    calendarEvents: this.props.events,
    isOpenCreateModal:false,
    startSelected:"",
    endSelected:""
  };

  toggleCreateModal=()=>{
    this.setState({
      isOpenCreateModal:!this.state.isOpenCreateModal
    })
  }

  handleCreateIssue=({summary,start})=>{
    this.setState({          
          calendarEvents: this.state.calendarEvents.concat({            
            title: summary,
            start: start,            
          })
        });
    this.props.createIssue({summary,start})
  }

  render() {
    return (
      <div className="calendar-app">
        <div className="calendar-app-top">
          {/* <button onClick={this.toggleWeekends}>toggle weekends</button>&nbsp;
          <button onClick={this.gotoPast}>go to a date in the past</button> */}          
        </div>
        <div className="calendar-app-calendar">
          <CreateIssueModal startDate={this.state.startSelected} createIssue={this.handleCreateIssue} isOpen={this.state.isOpenCreateModal} toggle={this.toggleCreateModal}/>
          <FullCalendar
            defaultView="dayGridMonth"
            header={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
            }}
            editable={true}
            locale='es'
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            ref={this.calendarComponentRef}
            weekends={this.state.calendarWeekends}
            events={this.state.calendarEvents}
            eventDrop={this.handleEventDrop}
            dateClick={this.handleDateClick}
          />
        </div>
      </div>
    );
  }

  handleEventDrop = (info) => {
    if(window.confirm("Estas seguro que quieres cambiar la fecha de evento?")){
      console.log('change confirmed')
      console.log(info,info.event.extendedProps.key)
      // updateAppointment is another custom method
      this.props.updateDate({key:info.event.extendedProps.key,start: info.event.start, end: info.event.end})

    } else {
        console.log('change aborted')
    }
  }

  toggleWeekends = () => {
    this.setState({
      // update a property
      calendarWeekends: !this.state.calendarWeekends
    });
  };

  gotoPast = () => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.gotoDate("2022-01-01"); // call a method on the Calendar object
  };

  handleDateClick = arg => {
    this.setState({startSelected:arg.dateStr})
    console.log(arg)
    this.toggleCreateModal()  
    // if (confirm("Quieres agregar una actividad con fecha " + arg.dateStr + " ?")) {
    //   this.setState({
    //     // add new event data
    //     calendarEvents: this.state.calendarEvents.concat({
    //       // creates a new array
    //       title: "New Event",
    //       start: arg.date,
    //       allDay: arg.allDay
    //     })
    //   });
    // }
  };
}
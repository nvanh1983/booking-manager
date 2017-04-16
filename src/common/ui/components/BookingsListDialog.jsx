import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Dialog, FlatButton, List, ListItem } from 'material-ui'

const mapStateToProps = state => {
	return {
		selectedDate: state.selectedDate,
		bookingsByDate: state.bookingsByDate,
		isLoggedIn: state.user.isLoggedIn
	}
}

// Define the Booking Dialog component
class BookingsListDialogComponent extends Component {
	constructor(props) {
		super(props)

		// Initialize the default state
		this.state = this.defaultState = {
			open: false,
			date: this.props.selectedDate,
			timeSlot: 1
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.selectedDate !== this.state.date) {
			this.setState({ date: nextProps.selectedDate })
			this.defaultState.date = nextProps.selectedDate
		}
	}

	show(props) {
		this.setState({
			...props,
			open: true
		})
	}

	dismiss() {
		this.setState(this.defaultState)
	}

	render() {
		// Define the action buttons to display in the dialog
		const actions = [
			<FlatButton label="Ok" secondary={true} onTouchTap={() => this.dismiss()} />
		]

		if (this.props.isLoggedIn && this.props.onClickAdd) {
			actions.unshift(<FlatButton label="Add" secondary={true} onTouchTap={() => this.props.onClickAdd ? this.props.onClickAdd({ date: this.state.date, timeSlot: this.state.timeSlot }) : null} />)
		}

		return (
			<Dialog contentClassName="dialog" title="Bookings" autoScrollBodyContent={true} actions={actions} open={this.state.open} onRequestClose={() => this.dismiss()}>
				{
					// If bookings exist for the specific date and timeslot, display them in the list
					// Else, display a message to the user
					this.props.bookingsByDate[this.state.date] && (() => {
						let bookingsByTimeSlot = this.props.bookingsByDate[this.state.date].items.filter((booking) => {
							for (let i = 0; i < booking.duration; ++i) {
								if (booking.timeSlot + i === this.state.timeSlot) {
									return true
								}
							}

							return false
						})

						if (bookingsByTimeSlot.length > 0) {
							return (
								<List>
									{
										bookingsByTimeSlot.map((booking) => (
											<ListItem primaryText={booking.bookingTitle} secondaryText={booking.bookingDesc} onTouchTap={() => this.props.onClickBooking ? this.props.onClickBooking({ mode: 1, ...booking }) : null} key={booking.bookingId} />
										))
									}
								</List>
							)
						} else {
							return (<h2>No bookings found.</h2>)
						}
					})()
				}
			</Dialog>
		)
	}
}

// Define the property types that the component expects to receive
BookingsListDialogComponent.propTypes = {
	selectedDate: PropTypes.string.isRequired,
	bookingsByDate: PropTypes.object.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	onClickAdd: PropTypes.func,
	onClickBooking: PropTypes.func
}

// Define the container for the Bookings List Dialog component (maps state)
const BookingsListDialog = connect(mapStateToProps, null, null, { withRef: true })(BookingsListDialogComponent)

export default BookingsListDialog
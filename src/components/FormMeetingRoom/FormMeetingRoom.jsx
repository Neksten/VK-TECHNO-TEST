import React, {useMemo, useState} from "react";
import 'react-datetime-picker/dist/DateTimePicker.css';
import DateTimePicker from 'react-datetime-picker';
import DropDrown from "../DropDrown/DropDrown";
import Toast from "../Toast/Toast";

// Константы количества башен и переговорных
const COUNT_FLOORS = 25
const COUNT_MEETING_ROOMS = 10
// Дата + 3 часа
const initialDate = new Date(new Date().getTime() + 10800000)

const FormMeetingRoom = () => {
	const [tower, setTower] = useState(null)
	const [floor, setFloor] = useState(null)
	const [meetingRoom, setMeetingRoom] = useState(null)
	const [intervalTime, setIntervalTime] = useState('11:00 - 13:00')
	const [valueTextarea, setValueTextarea] = useState('')
	const [sendForm, setSendForm] = useState(null)
	const [visible, setVisible] = useState(false);
	const [date, setDate] = useState(initialDate);
	
	const form = {
		towers: [
			{
				tower: 'А',
				floors: Array.from({ length: COUNT_FLOORS }, (_, i) => (
					{
						floor: i + 3,
						meetingRooms: Array.from({ length: COUNT_MEETING_ROOMS }, (_, i) => i + 1)
					}
				)),
			},
			{
				tower: 'Б',
				floors: Array.from({ length: COUNT_FLOORS }, (_, i) => (
					{
						floor: i + 3,
						meetingRooms: Array.from({ length: COUNT_MEETING_ROOMS }, (_, i) => i + 1)
					}
				)),
			},
		],
		timesInterval: ['11:00 - 13:00', '13:30 - 15:30', '16:00 - 18:00']
	}
	
	// Оптимизация для dropdowns
	const optionsTower = useMemo(() => form.towers.map(i => i.tower), [form.towers]);
	const optionsFloor = useMemo(() => tower && form.towers.find(i => i.tower === tower).floors.map(i => i.floor), [form.towers, tower]);
	const optionsMeetingRoom = useMemo(() => tower && floor && form.towers.find(i => i.tower === tower).floors.find(i => i.floor === floor).meetingRooms, [form.towers, tower, floor]);
	
	// Для выбора даты и времени
	function onChangeDate(selectedDate) {
		setDate(selectedDate);
	}
	
	// Всплывающее сообщение
	const handleToast = () => {
		setVisible(true);
		setTimeout(() => {
			setVisible(false);
		}, 3000); // 3 секунды
	};
	
	// Для выбора интервала
	function onClickInterval(e) {
		setIntervalTime(e.target.textContent)
	}
	// При отправке формы
	function handleFormSubmit(e) {
		e.preventDefault()
		
		setSendForm(true)
		// Если все обязательные параметры выбраны, то отправить.
		if (tower && floor && meetingRoom && date && intervalTime) {
			const sendForm = {
				tower,
				floor,
				room: meetingRoom,
				date,
				intervalTime,
				comment: valueTextarea
			}
			console.log(JSON.stringify(sendForm))
			handleClear()
		} else {
			handleToast()
		}
	}
	// При клике на кнопку "очистить"
	function handleClear() {
		setTower(null)
		setFloor(null)
		setMeetingRoom(null)
		setValueTextarea('')
		setSendForm('')
		setDate(initialDate)
		setIntervalTime('11:00 - 13:00')
	}
	
	// Вернет цвет относительно статуса
	const determineStatusColor = (dropdown) => {
		// если произошел клик на отправку, то проверит равняется ли элемент null, иначе выбрали ли уже параметр
		return sendForm ? (dropdown ? '#49CC90' : '#F93E3E') : dropdown ? '#49CC90' : '#E7E8EA'
	}
	
	return (
		<form onSubmit={handleFormSubmit} className="form-meeting-room">
			{visible && <Toast message={'Выберите все обязательные параметры'}/>}
			
			<h3 className="form-meeting-room__title">Забронировать переговорную</h3>
			<div className="form-meeting-room__dropdowns">
				<div className="form-meeting-room__row">
					<DropDrown initialText={{placeholder: 'Выберите башню', selected: 'Башня'}}
					           options={optionsTower}
					           selectedOption={tower}
					           setSelectedOption={setTower}
					           statusColor={determineStatusColor(tower)}
					/>
					<DropDrown initialText={{placeholder: 'Выберите этаж', selected: 'Этаж'}}
					           options={optionsFloor}
					           selectedOption={floor}
					           setSelectedOption={setFloor}
					           statusColor={determineStatusColor(floor)}
					           hide={tower}
					/>
				</div>
				<div className="form-meeting-room__row">
					<DropDrown initialText={{placeholder: 'Выберите переговорную', selected: 'Переговорная'}}
					           options={optionsMeetingRoom}
					           selectedOption={meetingRoom}
					           setSelectedOption={setMeetingRoom}
					           statusColor={determineStatusColor(meetingRoom)}
					           hide={floor}
					/>
					<DateTimePicker onChange={onChangeDate}
					                value={date}
					                minDate={initialDate}
					                maxDate={new Date('2033-12-31')}
					                format="dd.MM.y"
					                className={`${date ? (tower && floor && meetingRoom ? 'selected' : '') : 'error'} ${tower && floor && meetingRoom ? '' : 'hide'}`}
					/>
				</div>
			</div>
			<div className={`form-meeting-room__intervals ${meetingRoom && date ? '' : 'hide'}`}>
				{form.timesInterval.map(i => (
					<div key={i} onClick={onClickInterval}
					     style={meetingRoom ? {'border': `1px solid ${intervalTime === i ? '#49CC90' : '#E7E8EA'}`}: {}}
					     className="form-meeting-room__interval">{i}</div>
				))}
			</div>
			<textarea name="" id="" cols="30" rows="10"
			          className="form-meeting-room__textarea"
			          placeholder="Введите комментарий..."
			          value={valueTextarea}
			          onChange={(e) => setValueTextarea(e.target.value)}/>
			<div className="form-meeting-room__buttons">
				<button type="submit" className="form-meeting-room__btn form-meeting-room__btn-send">Отправить</button>
				<button type="button" onClick={handleClear} className="form-meeting-room__btn form-meeting-room__btn-clear">Очистить</button>
			</div>
		</form>
	)
}

export default FormMeetingRoom;
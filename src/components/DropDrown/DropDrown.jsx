import React, {useState} from "react";
import styles from "./DropDown.module.css"
import {ArrowDown} from "../../assets/ArrowDown";
import OutsideClickHandler from "../OutsideClickHandler";

const DropDrown = ({initialText, options, selectedOption, setSelectedOption, statusColor, hide}) => {
	const [isOpen, setIsOpen] = useState(false)
	
	// Открытие/закрытие dropdown
	function toggleDropdown() {
		setIsOpen(!isOpen)
	}
	// При клике на элемент dropdown
	function handleOptionClick(option) {
		setSelectedOption(option)
		setIsOpen(false)
	}
	
	return (
		<div className={`${styles.dropdown} ${hide === null ? styles.hide : ''}`}>
			<OutsideClickHandler onOutsideClick={setIsOpen}>
				<div style={{'borderColor': statusColor}} className={styles.header} onClick={toggleDropdown}>
					<span>{selectedOption ? `${initialText.selected}: ${selectedOption}` : initialText.placeholder}</span>
					<div className={styles.arrow}>
						<ArrowDown/>
					</div>
				</div>
				{isOpen && hide !== null &&
					<ul className={styles.list}>
						{options.map((option) => (
							<li key={option} onClick={() => handleOptionClick(option)}>
								{option}
							</li>
						))}
					</ul>
				}
			</OutsideClickHandler>
		</div>
	)
}

export default DropDrown;
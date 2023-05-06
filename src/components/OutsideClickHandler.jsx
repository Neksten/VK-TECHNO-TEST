import React, {useEffect, useRef} from "react";

// Выполнит onOutsideClick если клик произошел вне элемента
const OutsideClickHandler = ({ onOutsideClick, children }) => {
	const ref = useRef(null);
	
	useEffect(() => {
		function handleClickOutside(event) {
			// если клик произошел вне dropdown, то закрыть его
			if (ref.current && !ref.current.contains(event.target)) {
				onOutsideClick(false);
			}
		}
		
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	
	return <div ref={ref}>{children}</div>;
}

export default OutsideClickHandler;
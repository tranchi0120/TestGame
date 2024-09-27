/* eslint-disable react/prop-types */
const Button = ({
    clickedNumber,
    number,
    getStyle,
    hiddenNumbers,
    handleClick
}) => {
    return (
        <div>
            <button
                className={`number-circle ${
                    clickedNumber === number ? 'clicked' : ''
                }`}
                onClick={() => handleClick(number)}
                style={getStyle(number)}
            >
                {hiddenNumbers[number - 1] ? '' : number}
            </button>
        </div>
    )
}

export default Button

type ButtonProps = {
    text: string
}

function Button({ text }: ButtonProps) {
    return (
        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            {text}
        </button>
    )
}

export default Button
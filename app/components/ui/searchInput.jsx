import { Input } from '@nextui-org/react'

const SearchBar = ({ value, onChange }) => (
	<Input
		className="w-[300px]"
		clearable
		placeholder="🔍Search..."
		value={value}
		variant="faded"
		onChange={(e) => onChange(e.target.value)}
		css={{ width: '30%', marginBottom: '1rem' }}
	/>
)

export default SearchBar

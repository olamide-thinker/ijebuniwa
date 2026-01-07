// LINES 62-73 SHOULD LOOK LIKE THIS:

<AuthContextProvider>
	<AccountButton />
</AuthContextProvider>

// NOT LIKE THIS:
<AuthContextProvider>

			<Link href={`/account`}>
				<button
					title="My Account"
					className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-50 text-primary"
				>
					<UserCircle2 size={24} />
				</button>
			</Link>
</AuthContextProvider>

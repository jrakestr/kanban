// Parameter: Authorization
// Format: Bearer ${token}

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Box,
	Button,
	Container,
	FormControl,
	FormLabel,
	Heading,
	Select,
	Textarea,
	VStack,
	useColorModeValue,
	FormErrorMessage,
} from "@chakra-ui/react";

import { retrieveTicket, updateTicket } from "../api/ticketAPI";
import { TicketData } from "../interfaces/TicketData";

const EditTicket = () => {
	const [ticket, setTicket] = useState<TicketData | undefined>();
	const [error, setError] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	useEffect(() => {
		const fetchTicket = async () => {
			try {
				const id = location.state?.id;
				if (id) {
					const data = await retrieveTicket(id);
					setTicket(data);
				}
			} catch (err) {
				console.error("Failed to fetch ticket:", err);
				setError(true);
			}
		};
		fetchTicket();
	}, [location.state?.id]);

	const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
	};

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!ticket?.name) {
			setError(true);
			return;
		}
		try {
			if (ticket.id) {
				await updateTicket(ticket.id, ticket);
				navigate("/");
			}
		} catch (err) {
			console.error("Failed to update ticket:", err);
			setError(true);
		}
	};

	return (
		<Container maxW="container.md" py={8}>
			{ticket ? (
				<Box
					as="form"
					onSubmit={handleSubmit}
					bg={bgColor}
					p={8}
					borderRadius="lg"
					boxShadow="base"
					borderWidth="1px"
					borderColor={borderColor}
				>
					<VStack spacing={6} align="stretch">
						<Heading size="lg" textAlign="center">
							Edit Ticket
						</Heading>

						<FormControl isInvalid={error}>
							<FormLabel>Ticket Name</FormLabel>
							<Textarea
								name="name"
								value={ticket.name || ""}
								onChange={handleTextAreaChange}
								placeholder="Enter ticket name"
								size="lg"
							/>
							{error && (
								<FormErrorMessage>Ticket name is required</FormErrorMessage>
							)}
						</FormControl>

						<FormControl>
							<FormLabel>Ticket Status</FormLabel>
							<Select
								name="status"
								value={ticket.status || ""}
								onChange={handleChange}
								size="lg"
							>
								<option value="Todo">Todo</option>
								<option value="In Progress">In Progress</option>
								<option value="Done">Done</option>
							</Select>
						</FormControl>

						<FormControl>
							<FormLabel>Ticket Description</FormLabel>
							<Textarea
								name="description"
								value={ticket.description || ""}
								onChange={handleTextAreaChange}
								placeholder="Enter ticket description"
								size="lg"
								minH="150px"
							/>
						</FormControl>

						<Button type="submit" colorScheme="blue" size="lg">
							Update Ticket
						</Button>
					</VStack>
				</Box>
			) : (
				<Box textAlign="center" py={10}>
					<Heading size="md">Issues fetching ticket</Heading>
				</Box>
			)}
		</Container>
	);
};

export default EditTicket;

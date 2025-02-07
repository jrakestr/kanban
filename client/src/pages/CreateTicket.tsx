// Parameter: Authorization
// Format: Bearer ${token}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
	HStack,
} from "@chakra-ui/react";

import { createTicket } from "../api/ticketAPI";
import { TicketData } from "../interfaces/TicketData";

const CreateTicket = () => {
	const navigate = useNavigate();
	const [error, setError] = useState(false);
	const [newTicket, setNewTicket] = useState<Partial<TicketData>>({
		name: "",
		status: "Todo",
		description: "",
	});

	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setNewTicket((prev) => ({ ...prev, [name]: value }));
	};

	const handleTextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setNewTicket((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTicket.name) {
			setError(true);
			return;
		}
		try {
			await createTicket(newTicket);
			navigate("/");
		} catch (err) {
			console.error("Failed to create ticket:", err);
			setError(true);
		}
	};

	return (
		<Container maxW="container.md" py={8}>
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
						Create Ticket
					</Heading>

					<FormControl isInvalid={error}>
						<FormLabel>Ticket Name</FormLabel>
						<Textarea
							name="name"
							value={newTicket?.name || ""}
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
							value={newTicket?.status || ""}
							onChange={handleTextChange}
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
							value={newTicket?.description || ""}
							onChange={handleTextAreaChange}
							placeholder="Enter ticket description"
							size="lg"
							minH="150px"
						/>
					</FormControl>

					<HStack spacing={4} justify="center">
						<Button type="submit" colorScheme="blue" size="lg">
							Create Ticket
						</Button>
						<Button
							type="button"
							variant="outline"
							size="lg"
							onClick={() => navigate("/")}
						>
							Cancel
						</Button>
					</HStack>
				</VStack>
			</Box>
		</Container>
	);
};

export default CreateTicket;

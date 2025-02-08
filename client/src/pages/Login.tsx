import {
  Grid,
  GridItem,
  Box,
  Input,
  Button,
  Text,
  Heading,
  useToast,
  Image,
  keyframes,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useColorModeValue
} from '@chakra-ui/react';
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import kanbanLogo from '../assets/kanban.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.400, blue.600)',
    'linear(to-br, blue.600, blue.800)'
  );
  const formBg = useColorModeValue('white', 'gray.800');

  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log('🔍 [Login Form] Submit started');
    e.preventDefault();
    
    // Validate input
    if (!username || !password) {
      setError('Username and password are required');
      toast({
        title: 'Error',
        description: 'Please enter both username and password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      console.log('🔍 [Login Form] Calling login with:', { username });
      await login({ username, password });
      console.log('🔍 [Login Form] Login successful, navigating to /');
      navigate('/');
      toast({
        title: 'Success',
        description: 'Successfully logged in!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.log('🔍 [Login Form] Login failed:', err);
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  `;

  return (
    <Grid
      templateColumns={{ base: '1fr', md: '1fr 1fr' }}
      h="100vh"
      m={0}
      p={0}
    >
      {/* Left side - Animated Background */}
      <GridItem
        bgGradient={bgGradient}
        position="relative"
        overflow="hidden"
        display={{ base: 'none', md: 'block' }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-br, blue.400, blue.600)"
          opacity={0.9}
        />
        <VStack
          position="relative"
          h="full"
          justify="center"
          spacing={8}
          p={10}
        >
          <Image
            src={kanbanLogo}
            alt="Kanban Logo"
            w="300px"
            animation={`${float} 3s ease-in-out infinite`}
          />
          <Heading
            color="white"
            size="2xl"
            textAlign="center"
            textShadow="2px 2px 4px rgba(0,0,0,0.2)"
          >
            Welcome to Kanban
          </Heading>
          <Text
            color="whiteAlpha.900"
            fontSize="xl"
            textAlign="center"
            maxW="500px"
          >
            Organize your tasks, streamline your workflow, and boost your productivity
          </Text>
        </VStack>
      </GridItem>

      {/* Right side - Login Form */}
      <GridItem
        bg="gray.50"
        p={{ base: 8, md: 20 }}
      >
        <VStack
          spacing={8}
          w="full"
          h="full"
          justify="center"
        >
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={3} w="full" align="flex-start">
            <Heading size="xl" color="gray.700">
              Sign In
            </Heading>
            <Text color="gray.500">
              Enter your credentials to access your account
            </Text>
          </VStack>

          <VStack spacing={6} w="full">
            <FormControl isInvalid={!!error}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                size="lg"
                bg={formBg}
                required
              />
            </FormControl>

            <FormControl isInvalid={!!error}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                size="lg"
                bg={formBg}
                required
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText="Signing in..."
              h={14}
            >
              Sign In
            </Button>
          </VStack>

          <HStack spacing={2} color="gray.500">
            <Text>Don't have an account?</Text>
            <Text color="blue.600" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
              Sign up
            </Text>
          </HStack>
          </form>
        </VStack>
      </GridItem>
    </Grid>
  );
}
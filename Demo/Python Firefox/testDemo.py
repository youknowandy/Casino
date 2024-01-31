from test_demo import TestDemo

# create an object of TestTestTotals class
test = TestDemo()

# call the setup_method method to initialize the driver
test.setup_method(None)

# execute the test_testTotals method
test.test_demo()

# call the teardown_method method to close the driver
test.teardown_method(None)

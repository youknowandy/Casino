from test_testTotals import TestTestTotals

# create an object of TestTestTotals class
test = TestTestTotals()

# call the setup_method method to initialize the driver
test.setup_method(None)

# execute the test_testTotals method
test.test_testTotals()

# call the teardown_method method to close the driver
test.teardown_method(None)

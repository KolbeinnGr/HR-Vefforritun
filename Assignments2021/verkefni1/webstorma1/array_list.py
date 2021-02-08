class IndexOutOfBounds(Exception):
    pass

class Empty(Exception):
    pass

class ArrayList:
    def __init__(self):
        self.size = 0
        self.capacity = 4
        self.arr = [0] * self.capacity

    #Time complexity: O(n) - linear time in size of list
    def __str__(self):
        return_string = ""
        for i in range(self.size):
            return_string += f"{self.arr[i]}, "
        return return_string.rstrip(", ")
    
    def size_checker_helper(self):
        if (self.size >= self.capacity):
            self.resize()
    
    def index_checker_helper(self, index):
        if index > self.size:
            raise IndexOutOfBounds("Index is out of bounds")
            #return

    #Time complexity: O(n) - linear time in size of list
    def prepend(self, value):
        self.size_checker_helper()
        updated_arr = [0] * self.capacity
        
        updated_arr[0] = value
        for i in range(self.size):
            updated_arr[i+1] = self.arr[i]
        self.size += 1
        self.arr = updated_arr

    #Time complexity: O(n) - linear time in size of list
    def insert(self, value, index):
        self.size_checker_helper()
        self.index_checker_helper(index)
        
        
        self.size += 1
        updated_arr = [0] * (self.capacity)
        inserted = False
        for i in range(self.size):
            if i == index:
                updated_arr[i] = value
                inserted = True
            elif inserted == False:
                updated_arr[i] = self.arr[i]
            elif inserted == True:
                updated_arr[i] = self.arr[i-1]
        self.arr = updated_arr
        
        
    #Time complexity: O(1) - constant time
    def append(self, value):
        self.size_checker_helper()

        self.arr[self.size] = value
        self.size += 1
        
        
    #Time complexity: O(1) - constant time
    def set_at(self, value, index):
        self.index_checker_helper(index)

        self.arr[index] = value

    #Time complexity: O(1) - constant time
    def get_first(self):
        if self.size == 0:
            raise Empty("List is empty")
        return self.arr[0]


    #Time complexity: O(1) - constant time
    def get_at(self, index):
        self.index_checker_helper(index)
    
        return self.arr[index]


    #Time complexity: O(1) - constant time
    def get_last(self):
        if self.size == 0:
            raise Empty("List is empty")
        return self.arr[0]

    #Time complexity: O(n) - linear time in size of list
    def resize(self):
        
        self.capacity *= 2
        
        new_arr = [0] * self.capacity

        for i in range(self.size):
            new_arr[i] = self.arr[i]
        
        self.arr = new_arr

    #Time complexity: O(n) - linear time in size of list
    def remove_at(self, index):
        arr2 = [0] * self.size
        for i in range(self.size):
            if i == index:
                continue
            else:
                arr2[i] = self.arr[i]
        
        self.arr = arr2



    #Time complexity: O(1) - constant time
    def clear(self):
        arr2 = [0] * self.size
        self.arr = arr2

    #Time complexity: O(n) - linear time in size of sublist
    def sublist(self, start, length):
        # TODO: remove 'pass' and implement functionality
        pass

    #Time complexity: O(n) - linear time in size of concatinated list
    # OR
    #Time complexity: O(n+m) - linear time in size of both lists, self and other
    def concatenate(self, other):
        # TODO: remove 'pass' and implement functionality
        pass


if __name__ == "__main__":
    pass
    # add your tests here or in a different file.
    # Do not add them outside this if statement
    # and make sure they are at this indent level

    arr_lis = ArrayList()
    # print(str(arr_lis))
    arr_lis.append(0)
    arr_lis.append(1)
    arr_lis.append(2)
    arr_lis.append(3)
    arr_lis.append(4)

    print(arr_lis)
    arr_lis.prepend(5)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(7)
    arr_lis.prepend(12)

    arr_lis.set_at(15, 2)
    print(arr_lis)
    
    
    
    # print(str(arr_lis))
    print(arr_lis)
    # print(arr_lis)
    # print("after adding")
    
    # arr_lis.insert(11,15)

    
    # arr_lis.insert(6,5)
    
    # print(arr_lis)
    
    # arr_lis.append(5)
    # arr_lis.append(6)
    # arr_lis.append(7)
    # arr_lis.append(8)
    # arr_lis.append(9)
    # arr_lis.append(10)
    
    # print(arr_lis)
    
    # arr_lis.set_at(2,16)
    # print(arr_lis)
    # arr_lis.set_at(2,4)
    # print(arr_lis)
    # arr_lis.resize()
    # print(arr_lis)
    # arr_lis.remove_at(16)
    # print(arr_lis)
    # arr_lis.clear()
    # print(arr_lis)
package com.infodema.webcreator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

public class CodilityTest {

    public static void main(String[] args) {
        int[] array = new int[]{1,3,6,4,1,2};
        solution(array);
        //System.out.println(solution(array));
    }

    public static int solution(int[] array) {
        ArrayList<Integer> arrlist = new ArrayList<>();

        Arrays.sort(array);
        for(int i=0; i<array.length; i++) {

            arrlist.add(array[i]);
        }

        arrlist.forEach(System.out::println);


        for (int i = 1; i <= 100000; i++) {

            if(arrlist.contains(i)){

            }else{
                return i;
            }
//            for (int j = 0; j < A.length; j++) {
//                if(A[j] == i){
//                    A.
//                }
//            }

        }
//        for (int i = 0; i < A.length - 1; i++) {
//
//            int nextIndex = i+1;
//
//            if(nextIndex < A.length) {
//
//                int nextValue = A[nextIndex];
//
//                if(nextValue == (A[i] + 1)) {
//
//                }else{
//                    int res = (A[i] + 1 == 0) ? 1 : A[i] + 1;
//                    boolean match = IntStream.of(A).anyMatch(z -> z == res);
//                    if(match) {
//                        return (A[i] + 1 == 0) ? 1 : A[i] + 1;
//                    }
//                }
//            }else{
//                return (A[A.length-1] + 1) == 0 ? 1 : A[A.length-1] + 1;
//            }
//        }
//
//        return A[A.length - 1];
//        return Arrays.stream(A).sorted().forEach(n -> {
//            int x = n+1;
//            int currentIndex = List.of(A).indexOf(n);
//            int nextIndex = currentIndex +1;
//            int nextValue = A[nextIndex];
//            if(!(x == nextValue)){
//               return ;
//            }
//        });
return 0;
    }


}

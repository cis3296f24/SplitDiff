//
//  ContentView.swift
//  SplitDiff
//
//  Created by Phuykong on 10/28/24.
//

import SwiftUI
import PhotosUI
import AIReceiptScanner

struct ContentView: View {
    
    @StateObject var receiptImageModel = ReceiptImageModel()
    
    var body: some View {
        ZStack(alignment: .bottom) {
            
            VStack {
                Text("🧾")
                    .font(.system(size: 24))
                Text("Split Diff!")
                    .font(.headline)
                
                RandomTest(viewModel: receiptImageModel)
                
                Button("Take a Picture") {
                    print("Took a Picture!")
                }
                .padding(.top, 20)
            }
            .padding()
        }
    }
}

struct RandomTest: View {
    @ObservedObject var viewModel: ReceiptImageModel
    
    var body: some View {
        
        VStack {
            
            ReceiptImageViewer(imageState: viewModel.imageState)
            
            PhotosPicker(selection: $viewModel.imageSelection,
                         matching: .images,
                         photoLibrary: .shared()){
                            Text("Choose A Picture")
    //            Image(systemName: "pencil.circle.fill")
    //                .symbolRenderingMode(.multicolor)
    //                .font(.system(size: 30))
    //                .foregroundColor(.accentColor)
            }
            
        }
        
        
    }
}

struct ReceiptImageViewer: View {
    let imageState: ReceiptImageModel.ImageState

    
    var body: some View {
        switch imageState {
        case .success(let image):
            image.resizable()
        case .loading:
            ProgressView()
        case .empty:
            EmptyView()
        case .failure:
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 40))
                .foregroundColor(.white)
        }
    }
}

#Preview {
    ContentView()
}
